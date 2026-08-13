import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hniijiacqjudybvoaltb.supabase.co';
const supabaseKey = 'sb_publishable_xklGnqWkLIpSmeBSqyQdag_LoDOHBIi';
const supabase = createClient(supabaseUrl, supabaseKey);

async function syncUsers() {
  console.log("Fetching users from app_users...");
  const { data: users, error } = await supabase.from('app_users').select('*');
  
  if (error) {
    console.error("Error fetching users:", error);
    return;
  }

  console.log(`Found ${users.length} users. Migrating to Supabase Auth...`);

  for (const user of users) {
    console.log(`\nProcessing user: ${user.email} (${user.role})`);
    
    let authUserId = null;

    // Try Sign Up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });

    if (authError) {
      console.log(`Sign up failed: ${authError.message}. Trying Sign In instead...`);
      // Try Sign In if already registered
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      });

      if (loginError) {
        console.error(`Sign in also failed for ${user.email}:`, loginError.message);
        continue;
      }
      authUserId = loginData.user.id;
    } else if (authData.user) {
      authUserId = authData.user.id;
    }

    if (authUserId) {
      console.log(`Successfully authenticated. UUID: ${authUserId}`);
      
      // Update app_users table with the new auth_id
      const { error: updateError } = await supabase
        .from('app_users')
        .update({ auth_id: authUserId })
        .eq('id', user.id);

      if (updateError) {
        console.error(`Failed to link auth_id to app_users for ${user.email}:`, updateError.message);
      } else {
        console.log(`Successfully linked auth_id for ${user.email}`);
      }
    }
  }
  console.log("\nSync process completed.");
}

syncUsers();

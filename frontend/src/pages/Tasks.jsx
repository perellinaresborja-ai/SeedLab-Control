import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, AlertCircle, Plus, X, Trash2, Microscope, Package, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

export default function Tasks() {
  const { tests, batches, varieties, customTasks, addCustomTask, toggleCustomTask, deleteCustomTask } = useAppContext();
  const [newTask, setNewTask] = useState('');

  // Auto-generated alerts
  const testsToReview = tests.filter(test => test.status === 'Review');
  
  const lowStockVarieties = varieties.filter(variety => {
    const totalStock = batches
      .filter(batch => batch.variety === variety.name)
      .reduce((sum, batch) => sum + batch.currentQty, 0);
    return variety.minStock > 0 && totalStock <= variety.minStock;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      addCustomTask(newTask.trim());
      setNewTask('');
    }
  };

  return (
    <div className="relative h-full flex flex-col pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 drop-shadow-md">Task Management</h1>
          <p className="text-text-muted">Manage automated alerts and personal reminders.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Automated System Alerts */}
        <div className="flex flex-col space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-primary-cyan"/> System Alerts
          </h2>
          
          <div className="space-y-4">
            {testsToReview.length > 0 ? testsToReview.map(test => (
              <motion.div key={test.id} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="glass-panel p-4 border-l-4 border-l-yellow-400 flex justify-between items-center group hover:bg-card/80 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-2 bg-yellow-400/10 rounded"><Microscope className="w-4 h-4 text-yellow-400"/></div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Pending Signature: {test.id}</h3>
                    <p className="text-xs text-text-muted mt-0.5">Test for {test.batch} has reached Review status and requires Quality Manager sign-off.</p>
                  </div>
                </div>
                <Link to="/lab" className="text-xs text-primary-cyan opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Go to Lab &rarr;</Link>
              </motion.div>
            )) : null}

            {lowStockVarieties.length > 0 ? lowStockVarieties.map(variety => {
              const totalStock = batches.filter(b => b.variety === variety.name).reduce((sum, b) => sum + b.currentQty, 0);
              return (
                <motion.div key={variety.id} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="glass-panel p-4 border-l-4 border-l-orange-400 flex justify-between items-center group hover:bg-card/80 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 p-2 bg-orange-400/10 rounded"><Package className="w-4 h-4 text-orange-400"/></div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Low Stock Warning: {variety.name}</h3>
                      <p className="text-xs text-text-muted mt-0.5">Total stock is {totalStock.toLocaleString()} seeds (Below minimum of {variety.minStock.toLocaleString()}).</p>
                    </div>
                  </div>
                  <Link to="/inventory" className="text-xs text-primary-cyan opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Go to Inventory &rarr;</Link>
                </motion.div>
              );
            }) : null}

            {testsToReview.length === 0 && lowStockVarieties.length === 0 && (
              <div className="glass-panel p-8 text-center flex flex-col items-center border-l-4 border-l-primary-green">
                <ShieldCheck className="w-10 h-10 text-primary-green/50 mb-3" />
                <h3 className="text-sm font-bold text-white">All Clear</h3>
                <p className="text-xs text-text-muted">No pending system alerts.</p>
              </div>
            )}
          </div>
        </div>

        {/* Manual To-Do List */}
        <div className="flex flex-col space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center">
            <CheckSquare className="w-5 h-5 mr-2 text-primary-cyan"/> Custom Reminders
          </h2>
          
          <div className="glass-panel p-6 border-l-4 border-l-primary-cyan">
            <form onSubmit={handleAddSubmit} className="flex space-x-3 mb-6">
              <input 
                type="text" 
                value={newTask} 
                onChange={e => setNewTask(e.target.value)} 
                placeholder="Add a new reminder..."
                className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-cyan"
              />
              <button type="submit" disabled={!newTask.trim()} className="tech-button bg-primary-cyan text-black hover:bg-primary-cyan/90 disabled:opacity-50 flex items-center">
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-2">
              <AnimatePresence>
                {customTasks.map(task => (
                  <motion.div 
                    key={task.id} 
                    initial={{opacity: 0, height: 0}} 
                    animate={{opacity: 1, height: 'auto'}} 
                    exit={{opacity: 0, height: 0}}
                    className="flex items-center justify-between p-3 bg-background/50 border border-border/50 rounded-md hover:border-primary-cyan/30 transition-colors group"
                  >
                    <div className="flex items-center flex-1 cursor-pointer" onClick={() => toggleCustomTask(task.id)}>
                      <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center transition-colors ${task.completed ? 'bg-primary-green border-primary-green' : 'border-text-muted/50'}`}>
                        {task.completed && <CheckSquare className="w-3 h-3 text-black" />}
                      </div>
                      <span className={`text-sm transition-colors ${task.completed ? 'text-text-muted line-through' : 'text-white'}`}>
                        {task.content}
                      </span>
                    </div>
                    <button onClick={() => deleteCustomTask(task.id)} className="text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {customTasks.length === 0 && (
                <p className="text-xs text-text-muted text-center py-4">No custom reminders.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

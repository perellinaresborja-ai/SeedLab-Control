import { useState, useCallback } from 'react';

export function useWebSerial() {
  const [port, setPort] = useState(null);
  const [reader, setReader] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');
  const [isSupported] = useState('serial' in navigator);

  const connect = useCallback(async () => {
    if (!isSupported) {
      setError('Web Serial API is not supported in this browser.');
      return false;
    }

    try {
      setError('');
      // Request a port and open a connection
      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 9600 }); // Common baud rate for scales
      
      setPort(selectedPort);
      return true;
    } catch (err) {
      console.error('Error connecting to serial port:', err);
      setError(err.message || 'Failed to connect to scale.');
      return false;
    }
  }, [isSupported]);

  const disconnect = useCallback(async () => {
    try {
      setIsReading(false);
      
      if (reader) {
        await reader.cancel();
      }
      if (port) {
        await port.close();
      }
      
      setPort(null);
      setReader(null);
      setWeight('');
    } catch (err) {
      console.error('Error disconnecting:', err);
    }
  }, [port, reader]);

  const readUntilClosed = useCallback(async () => {
    if (!port) return;
    
    setIsReading(true);
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const currentReader = textDecoder.readable.getReader();
    setReader(currentReader);

    try {
      let buffer = '';
      while (true) {
        const { value, done } = await currentReader.read();
        if (done) {
          break;
        }
        if (value) {
          buffer += value;
          // Scales usually send data separated by newlines
          const lines = buffer.split('\n');
          if (lines.length > 1) {
            // Keep the last complete line as the current weight reading
            // Often format is something like "  0.450 kg" or "S S      100 g"
            const latestCompleteRead = lines[lines.length - 2].trim();
            // Try to extract just numbers
            const match = latestCompleteRead.match(/[-+]?[0-9]*\.?[0-9]+/);
            if (match) {
              setWeight(match[0]);
            }
            // Keep any incomplete line in the buffer
            buffer = lines[lines.length - 1];
          }
        }
      }
    } catch (err) {
      console.error('Error reading from serial port:', err);
      setError('Connection lost or error reading data.');
    } finally {
      setIsReading(false);
      currentReader.releaseLock();
    }
  }, [port]);

  return {
    isSupported,
    isConnected: !!port,
    isReading,
    weight,
    error,
    connect,
    disconnect,
    readUntilClosed
  };
}

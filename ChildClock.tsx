import React, { useState, useEffect } from 'react';
import { Clock, Bed, Tv, Pause, Play, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ChildClock = () => {
  const [time, setTime] = useState(new Date());
  const [timers, setTimers] = useState({
    sleep: { duration: 30 * 60, running: false, remaining: 30 * 60, icon: <Bed /> },
    tv: { duration: 20 * 60, running: false, remaining: 20 * 60, icon: <Tv /> },
    shower: { duration: 10 * 60, running: false, remaining: 10 * 60, icon: <Clock /> }
  });
  const [newTimerName, setNewTimerName] = useState('');
  const [newTimerDuration, setNewTimerDuration] = useState('');
  const [newTimerIcon, setNewTimerIcon] = useState('Clock');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimers(prev => {
        const newTimers = { ...prev };
        Object.keys(newTimers).forEach(key => {
          if (newTimers[key].running && newTimers[key].remaining > 0) {
            newTimers[key].remaining -= 1;
          } else if (newTimers[key].remaining === 0) {
            newTimers[key].running = false;
            new Audio('/alarm.mp3').play();
          }
        });
        return { ...newTimers };
      });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  const toggleTimer = (timerKey) => {
    setTimers(prev => ({
      ...prev,
      [timerKey]: {
        ...prev[timerKey],
        running: !prev[timerKey].running,
        remaining: prev[timerKey].remaining === 0 ? prev[timerKey].duration : prev[timerKey].remaining
      }
    }));
  };

  const addNewTimer = () => {
    if (!newTimerName || !newTimerDuration) return;
    setTimers(prev => ({
      ...prev,
      [newTimerName]: {
        duration: newTimerDuration * 60,
        running: false,
        remaining: newTimerDuration * 60,
        icon: React.createElement(eval(newTimerIcon))
      }
    }));
    setNewTimerName('');
    setNewTimerDuration('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8 max-w-2xl mx-auto text-center bg-gray-100 rounded-xl shadow-md">
      <Card className="p-8 mb-8 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">⏰ השעון שלי</h2>
        <div className="text-4xl font-bold font-mono mb-4">
          {time.getHours().toString().padStart(2, '0')}:
          {time.getMinutes().toString().padStart(2, '0')}:
          {time.getSeconds().toString().padStart(2, '0')}
        </div>
      </Card>
      <div className="mb-4 flex flex-col items-center gap-2">
        <input 
          type="text" 
          placeholder="שם טיימר" 
          value={newTimerName} 
          onChange={(e) => setNewTimerName(e.target.value)}
          className="p-2 border rounded" 
        />
        <input 
          type="number" 
          placeholder="זמן בדקות" 
          value={newTimerDuration} 
          onChange={(e) => setNewTimerDuration(e.target.value)}
          className="p-2 border rounded" 
        />
        <select onChange={(e) => setNewTimerIcon(e.target.value)} className="p-2 border rounded">
          <option value="Clock">⏰ שעון</option>
          <option value="Bed">🛏 שינה</option>
          <option value="Tv">📺 טלוויזיה</option>
        </select>
        <Button onClick={addNewTimer} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg flex items-center">
          <PlusCircle className="mr-2" /> הוסף טיימר
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.keys(timers).map((timerKey) => (
          <Card key={timerKey} className="p-4 text-center bg-white rounded-lg shadow">
            <Button
              onClick={() => toggleTimer(timerKey)}
              className={`w-full mb-2 flex items-center justify-center p-2 rounded-lg ${timers[timerKey].running ? 'bg-red-500' : 'bg-green-500'}`}
            >
              {timers[timerKey].running ? <Pause className="mr-2" /> : <Play className="mr-2" />} 
              {timers[timerKey].running ? 'השהה' : 'הפעל'}
            </Button>
            <div className="text-xl font-bold mb-2">{formatTime(timers[timerKey].remaining)}</div>
            <div className="text-gray-700 mt-2 mx-auto" size={40}>{timers[timerKey].icon}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChildClock;

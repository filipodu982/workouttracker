import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useWorkoutContext } from '../../context/WorkoutContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPage = () => {
  const { workouts, loading, error } = useWorkoutContext();
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [exerciseData, setExerciseData] = useState([]);

  // Extract unique exercises from workouts
  useEffect(() => {
    if (workouts && workouts.length > 0) {
      const uniqueExercises = new Set();
      workouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
          uniqueExercises.add(exercise.name);
        });
      });
      setExercises(Array.from(uniqueExercises).sort());
    }
  }, [workouts]);

  // Process exercise data when an exercise is selected
  useEffect(() => {
    if (!selectedExercise || !workouts) return;

    const exerciseData = workouts
      .filter(workout => workout.exercises.some(ex => ex.name === selectedExercise))
      .map(workout => {
        const matchingExercises = workout.exercises.filter(
          exercise => exercise.name === selectedExercise
        );

        let totalVolume = 0;
        let maxOneRM = 0;

        matchingExercises.forEach(exercise => {
          exercise.sets.forEach(set => {
            // Calculate volume
            const volume = set.weight * set.reps;
            totalVolume += volume;

            // Estimate 1RM using Brzycki formula
            const oneRM = set.weight * (36 / (37 - set.reps));
            maxOneRM = Math.max(maxOneRM, oneRM);
          });
        });

        return {
          date: workout.date,
          displayDate: new Date(workout.date).toLocaleDateString(),
          totalVolume,
          estimatedOneRM: maxOneRM,
          unit: workout.unit
        };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setExerciseData(exerciseData);
  }, [selectedExercise, workouts]);

  // Chart configuration
  const volumeChartData = {
    labels: exerciseData.map(d => d.displayDate),
    datasets: [
      {
        label: 'Total Volume',
        data: exerciseData.map(d => d.totalVolume),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        yAxisID: 'y-volume'
      },
      {
        label: 'Estimated 1RM',
        data: exerciseData.map(d => d.estimatedOneRM),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
        yAxisID: 'y-1rm'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Exercise Progress Over Time'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(1) + ' ' + exerciseData[context.dataIndex].unit;
            }
            return label;
          }
        }
      }
    },
    scales: {
      'y-volume': {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Total Volume (kg)',
          color: 'rgb(75, 192, 192)'
        },
        ticks: {
          color: 'rgb(75, 192, 192)'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      'y-1rm': {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Estimated 1RM (kg)',
          color: 'rgb(255, 99, 132)'
        },
        ticks: {
          color: 'rgb(255, 99, 132)'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>;
  }

  return (
    <div className="p-4 lg:p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Exercise Analytics</h2>
      
      <div className="mb-6">
        <label htmlFor="exercise-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Exercise
        </label>
        <select
          id="exercise-select"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
        >
          <option value="">Select an exercise</option>
          {exercises.map((exercise) => (
            <option key={exercise} value={exercise}>
              {exercise}
            </option>
          ))}
        </select>
      </div>

      {selectedExercise && exerciseData.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <Line data={volumeChartData} options={chartOptions} />
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">Latest Volume</h3>
              <p className="text-2xl font-bold">
                {exerciseData[exerciseData.length - 1]?.totalVolume.toFixed(1)} {exerciseData[exerciseData.length - 1]?.unit}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">Latest Estimated 1RM</h3>
              <p className="text-2xl font-bold">
                {exerciseData[exerciseData.length - 1]?.estimatedOneRM.toFixed(1)} {exerciseData[exerciseData.length - 1]?.unit}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">Total Sessions</h3>
              <p className="text-2xl font-bold">{exerciseData.length}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 p-8 bg-white rounded-lg shadow-sm">
          {selectedExercise ? 'No data available for selected exercise' : 'Select an exercise to view analytics'}
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage; 
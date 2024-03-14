import axios from 'axios';
import { Task } from './types';
import * as qs from 'qs';
import { useState } from 'react';
import { environments } from '../../../environment';

type loadTaskProps = {
  city: string[];
  realEstateType: string;
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const loadTasks = async ({ city, realEstateType }: loadTaskProps) => {
    const dataTasks: Task[] = await axios
      .get(`${environments.REACT_APP_PROXY}/api/cities/tasks`, {
        params: { 'city[]': city, realEstateType },
        paramsSerializer: function (params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then((res) => res.data);

    setTasks(dataTasks);

    return dataTasks;
  };

  const getTasks = () => {
    return tasks;
  };

  return {
    tasks,
    loadTasks,
    getTasks,
  };
};

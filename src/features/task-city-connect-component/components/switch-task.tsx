import React from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import { Switch } from '@mui/material';
import { Size } from '../../../shared/enums/size.enum';
import { Task } from '../../../entities/task';

interface SwitchTaskProps {
  isAvailable: boolean;
  task: Task | undefined;
  setStatusTask: any;
}

export const SwitchTask: React.FC<SwitchTaskProps> = ({ isAvailable, task, setStatusTask }) => {
  if (!isAvailable) {
    return <RemoveIcon />;
  }

  const isDefaultChecked = !!(task && task?.isActive === true);

  return (
    <Switch
      size={Size.SMALL}
      checked={isDefaultChecked}
      onChange={(e) => {
        setStatusTask({ ...task, isActive: e.target.checked });
      }}
    />
  );
};

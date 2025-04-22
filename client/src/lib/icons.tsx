import { createContext, useContext } from 'react';

export const IconContext = createContext({
  size: '24',
  color: 'currentColor',
});

export const useIconContext = () => useContext(IconContext);

export type IconProps = {
  size?: string | number;
  color?: string;
  className?: string;
};

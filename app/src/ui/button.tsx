import React, { createElement } from 'react';
import './button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'large';
}

export function Button({ children, onClick, disabled, size, className, ...props }: ButtonProps) {
  const sizeClass = size === 'large' ? 'large' : undefined;
  const mergedClassName = [sizeClass, className].filter(Boolean).join(' ') || undefined;

  return createElement(
    'button',
    {
      onClick,
      className: mergedClassName,
      disabled,
      ...props,
    },
    children,
  );
}

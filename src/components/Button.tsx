import { Component, JSX } from 'solid-js';

interface ButtonProps {
  children: JSX.Element;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  class?: string;
}

const Button: Component<ButtonProps> = (props) => {
  const getVariantClasses = () => {
    switch (props.variant || 'primary') {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  const getSizeClasses = () => {
    switch (props.size || 'md') {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-base';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  return (
    <button
      type={props.type || 'button'}
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
      class={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        font-medium rounded-lg transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center
        ${props.class || ''}
      `}
    >
      {props.loading ? (
        <div class="flex items-center">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Loading...
        </div>
      ) : (
        props.children
      )}
    </button>
  );
};

export default Button;

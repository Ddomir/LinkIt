import { type LucideIcon } from 'lucide-react';

interface ButtonProps {
  icon: LucideIcon;
  label: string;
}

const IconButton = ({ icon: Icon, label }: ButtonProps) => {
  return (
    <button aria-label={label}>
      <Icon size={16} />
    </button>
  );
};

export default IconButton;
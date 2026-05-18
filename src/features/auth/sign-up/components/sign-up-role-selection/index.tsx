import { RoleType } from '@/constants';
import { Button } from '@/shared/components/ui/Button';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/Radio';
import { cn } from '@/shared/libs/utils';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState
} from 'react';
import { Link } from 'react-router-dom';

interface SignUpFormProps {
  initRole: RoleType;
  onSetRole: Dispatch<SetStateAction<RoleType | null>>;
}

export const SignUpRoleSelection = ({
  initRole,
  onSetRole
}: SignUpFormProps) => {
  const [role, setRole] = useState<RoleType>(initRole);
  const handleChangeRole = useCallback(
    (value: RoleType) => setRole(value),
    [role]
  );
  return (
    <div className="flex flex-col gap-6">
      <h4 className="font-bold">Sign up as</h4>
      <RadioGroup className="flex flex-col gap-3" defaultValue="patient">
        <label
          className={cn(
            'rounded-xl border border-border-inactive hover:border-border-brand-secondary',
            'flex items-start gap-4 px-4 py-3',
            'cursor-pointer transition-colors',
            role === 'patient' && 'border-border-brand-secondary'
          )}
          htmlFor="patient"
        >
          <RadioGroupItem
            className="mt-1"
            id="patient"
            onClick={() => handleChangeRole(RoleType.PATIENT)}
            value="patient"
          />
          <div className="flex flex-col gap-2">
            <span className="text-xl font-semibold">General user</span>
            <p className="text-text-description">
              I want to identify potential rare diseases for myself or a family
              member and connect with suitable rare disease experts
            </p>
          </div>
        </label>

        <label
          className={cn(
            'rounded-xl border border-border-inactive hover:border-border-brand-secondary',
            'flex items-start gap-4 px-4 py-3',
            'cursor-pointer transition-colors [&:has(:checked)]:bg-gray-50',
            role === 'expert' && 'border-border-brand-secondary',
            '[&:has(:disabled)]:opacity-50' // remove later
          )}
          htmlFor="expert"
        >
          <RadioGroupItem
            className="mt-1"
            id="expert"
            onClick={() => handleChangeRole(RoleType.EXPERT)}
            value="expert"
          />
          <div className="flex flex-col gap-2">
            <span className="text-xl font-semibold">Expert</span>
            <p className="text-text-description">
              I want to find suitable rare disease patients for my research,
              drug testing or clinical trials
            </p>
          </div>
        </label>
      </RadioGroup>
      <Button onClick={() => onSetRole(role)} size="lg" variant="primary">
        Continue
      </Button>
      <div className="border-t border-border-subtle text-center">
        <p className="mt-8 text-sm text-text-description">
          Already have an account?
          <Link
            className="ml-1 font-medium text-link-default hover:underline"
            to="/auth/login"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

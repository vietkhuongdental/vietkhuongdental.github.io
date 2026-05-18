import { RoleType } from '@/constants';
import SignUpForm from '@/features/auth/sign-up/components/sign-up-form';
import { SignUpRoleSelection } from '@/features/auth/sign-up/components/sign-up-role-selection';
import { useState } from 'react';

export default function SignUpScreen() {
  const [role, setRole] = useState<RoleType | null>(null);

  if (!role) {
    return (
      <SignUpRoleSelection initRole={RoleType.PATIENT} onSetRole={setRole} />
    );
  }

  return <SignUpForm role={role} />;
}

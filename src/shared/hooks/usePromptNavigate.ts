import { useEffect } from 'react';
import { useBeforeUnload, useBlocker } from 'react-router-dom';

export function usePromptNavigate(when: boolean, message: string) {
  // Block internal navigation
  const blocker = useBlocker(when);

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const proceed = window.confirm(message);
      if (proceed) blocker.proceed();
      else blocker.reset();
    }
  }, [blocker, message]);

  // Block tab close or reload
  useBeforeUnload(
    (event: BeforeUnloadEvent) => {
      if (when) {
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    },
    { capture: when }
  );
}

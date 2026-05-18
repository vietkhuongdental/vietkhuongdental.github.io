/* eslint-disable import/no-unresolved */

export default function EmptyPatient() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex h-fit w-fit flex-col items-center justify-center gap-6">
        <img
          alt="empty"
          className="object-fit h-[285px] w-[340px]"
          src="/search-patient-directory.png"
        />
        <div className="flex w-[635px] flex-col items-center justify-center gap-4">
          <span className="text-xl font-bold">Search patient directory</span>
          <p className="text-center text-lg text-text-default">
            Start search and connect with suitable patients
          </p>
        </div>
      </div>
    </div>
  );
}

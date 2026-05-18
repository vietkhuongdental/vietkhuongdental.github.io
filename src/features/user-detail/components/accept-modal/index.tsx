export default function AcceptModal() {
  return (
    <div className="h-fit max-w-[600px] flex-1 overflow-auto xl:w-[600px]">
      <form className="flex h-fit flex-col">
        <div className="flex h-[calc(100%-81px)] flex-col gap-[10px] p-6 text-text-default">
          <span className="text-md font-normal">
            Verified patient can create more health record and use Genorare
            analysis unlimited in a health record
          </span>
        </div>
      </form>
    </div>
  );
}

interface ErrorProps {
  error: {
    active: boolean;
    message: string;
  };
}

const ErrorPopup: React.FC<ErrorProps> = ({ error }) => {
  return (
    <>
      {error.active === true ? (
        <div className="mb-2 flex w-[350px] flex-col rounded-md bg-red-600 p-2">
          <label className="font-poppins text-[16px] font-semibold">Er is iets misgegaan:</label>
          <label className="font-poppins text-[14px] text-white">{error.message}</label>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default ErrorPopup;

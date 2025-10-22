interface LoadingOverlayProps {
  children?: React.ReactNode;
  progress?: string | number;
  vertical?: boolean;
  loading: boolean;
}

const LoadingOverlay = ({
  children,
  progress,
  vertical = true,
  loading,
}: LoadingOverlayProps) => {
  let boxStyle = 'flex-col text-white bg-black/30';
  let spinnerStyle = 'w-12 h-12 border-white';

  if (!vertical) {
    boxStyle = 'text-black';
    spinnerStyle = 'w-8 h-8 border-black';
  }

  return (
    <>
      {loading && (
        <div
          className={`flex gap-4 items-center justify-center flex-1 box-border ${boxStyle}`}
        >
          <p className='text-center font-bold'>{children}</p>
          <div
            className={`border-4 ${spinnerStyle} border-t-transparent rounded-full animate-spin`}
          ></div>
          {progress && <span>{progress}</span>}
        </div>
      )}
    </>
  );
};

export default LoadingOverlay;

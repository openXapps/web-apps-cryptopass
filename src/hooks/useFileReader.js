import { useEffect, useState } from 'react';

// const noop = () => { };

/**
 * Custom React Hook to read a file
 * @param {any} options Option are {frMethod: string, rfOnload: callback}
 * @returns Hook state as [{ frResult, frError, frFile, frLoading }, setFrFile]
 */
function useFileReader(options) {
  const { frMethod, rfOnload } = options;
  const [frFile, setFrFile] = useState(null);
  const [frError, setFrError] = useState('');
  const [frResult, setFrResult] = useState('');
  const [frLoading, setFrLoading] = useState(false);

  useEffect(() => {
    if (!frFile) return;

    const reader = new FileReader(frFile);
    reader.onloadstart = () => {
      setFrLoading(true);
    }

    reader.onloadend = () => {
      setFrLoading(false);
    }

    reader.onload = e => {
      setFrResult(e.target.frResult);
      rfOnload(e.target.frResult);
    }

    reader.onError = e => {
      setFrError(e);
    }

    try {
      reader[frMethod](frFile)
    } catch (e) {
      setFrError(e);
    }

    return () => {
      if (reader instanceof FileReader) {
        reader.removeEventListener('load', onload);
      }
    }
  }, [frFile]);

  return [{ frResult, frError, frFile, frLoading }, setFrFile];
}

export default useFileReader;
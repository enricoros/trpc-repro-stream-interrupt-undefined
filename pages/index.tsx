import * as React from 'react';
import { trpc } from '@/src/client';

export default function Home() {
  const [output, setOutput] = React.useState<string>('');

  const handleClick = async () => {
    console.log('Starting iterable call');
    setOutput('Starting (error: `undefined` around # on vercel)...\n');
    try {
      const iterable = await trpc.examples.iterable.mutate();
      for await (const num of iterable) {
        setOutput((prev) => prev + num + ' ');
      }
      console.log('Completed iterable');
    } catch (error: any) {
      console.warn('Caught error:', { errorType: typeof error, error });
      setOutput((prev) => prev + '\n\nError (check console): ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setOutput((prev) => prev + '\n\nDone.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={handleClick}>Start</button>
      <h1>Output:</h1>
      <div style={{ fontFamily: 'sans-serif', fontStyle: '16px', whiteSpace: 'pre-wrap' }}>{output}</div>
      <div>
        <br/>
        Errors observed:
        <ul>
          <li>For local development (or prod) 'Error: network error'</li>
          <li>For vercel edge deployment, connection cut in 5 min: 'undefined'</li>
        </ul>
      </div>
    </div>
  );
}

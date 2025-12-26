import type { FC } from 'preact/compat';
import { useState } from 'preact/hooks';

type GreetingProps = {
  messages: string[];
};

export const Greeting: FC<GreetingProps> = (props) => {
  const { messages } = props;

  const randomMessage = () => messages[Math.floor(Math.random() * messages.length)];

  const [greeting, setGreeting] = useState(messages[0]);

  return (
    <div>
      <h3>{greeting}! Thank you for visiting!</h3>
      <button onClick={() => setGreeting(randomMessage())}>New Greeting</button>
    </div>
  );
};

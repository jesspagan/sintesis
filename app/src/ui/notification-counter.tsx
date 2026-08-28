import './notification-counter.css';

export function NotificationCounter({ count }: { count: number }) {
  return <div className='notification-counter primary'>{count}</div>;
}

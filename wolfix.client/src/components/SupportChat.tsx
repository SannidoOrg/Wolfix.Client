import { FC } from 'react';
import styles from '../styles/SupportChat.module.css';

const SupportChat: FC = () => {
  return (
    <button className={styles.chatButton}>Чат з підтримкою</button>
  );
};

export default SupportChat;
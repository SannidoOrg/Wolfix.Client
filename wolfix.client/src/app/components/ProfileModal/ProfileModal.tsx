import { FC, useEffect, useRef } from "react";

interface IProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}

const ProfileModal: FC<IProfileModalProps> = ({ isOpen, onClose, anchorRef }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && anchorRef.current && modalRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      modalRef.current.style.position = 'absolute';
      modalRef.current.style.top = `${anchorRect.bottom + 10}px`;
      modalRef.current.style.left = `${anchorRect.left}px`;
    }
  }, [isOpen, anchorRef]);

  if (!isOpen) return null;

  return (
    <div className="profile-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
      <button onClick={onClose}>Закрити</button>
      <button>Вхід</button>
      <button>Реєстрація</button>
    </div>
  );
};

export default ProfileModal;
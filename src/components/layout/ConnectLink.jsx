// components/layout/ConnectLink.jsx
import React from 'react';
import { useQubicConnect } from '../../contexts/QubicConnectContext';
import { useHM25 } from '../../contexts/HM25Context';
import lockIcon from '../../assets/lock.svg';
import unlockedIcon from '../../assets/unlocked.svg';
import ConnectModal from './ConnectModal';

const ConnectLink = () => {
  const { connected, showConnectModal, toggleConnectModal } = useQubicConnect();
  const { balance, fetchBalance, walletPublicIdentity } = useHM25();

  // Al hacer clic en el texto de balance, refrescar balance manualmente
  const handleBalanceClick = async (e) => {
    e.stopPropagation();
    if (walletPublicIdentity) {
      await fetchBalance(walletPublicIdentity);
    }
  };

  return (
    <>
      {/* Enlace/área clicable en el header */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={toggleConnectModal}>
        {connected ? (
          // Si hay wallet conectada
          <>
            {/* Texto "Bloquear Wallet" en desktop */}
            <div className="hidden md:flex items-center gap-2 text-gray-800">
              <img src={lockIcon} alt="Wallet bloqueada" className="w-5 h-5" />
              <span className="text-sm font-medium">Bloquear Wallet</span>
            </div>
            {/* Mostrar balance (si cargado) con posibilidad de refrescar */}
            {balance != null && (
              <div 
                className="hidden md:block text-xs text-gray-600 hover:text-gray-800"
                onClick={handleBalanceClick}
                title="Click para refrescar balance"
              >
                Balance: {balance} QUBIC
              </div>
            )}
            {/* En vista móvil, solo icono */}
            <div className="md:hidden">
              <img src={lockIcon} alt="Wallet conectada" className="w-5 h-5" />
            </div>
          </>
        ) : (
          // Si NO hay wallet conectada
          <>
            {/* Texto "Conectar Wallet" en desktop */}
            <span className="hidden md:block text-sm font-medium text-gray-800">
              Conectar Wallet
            </span>
            {/* En móvil, solo icono */}
            <img src={unlockedIcon} alt="Wallet desconectada" className="w-5 h-5 md:hidden" />
          </>
        )}
      </div>

      {/* Modal de conexión (se renderiza aunque esté oculto, controlado por estado) */}
      <ConnectModal open={showConnectModal} onClose={toggleConnectModal} />
    </>
  );
};

export default ConnectLink;

import { useState } from 'react';
import { CoberturaProvider, useCobertura } from './context/CoberturaContext';
import { TitleBar } from './components/TitleBar';
import { HomeScreen } from './screens/HomeScreen';
import { CoberturaPremiumScreen } from './screens/CoberturaPremiumScreen';
import { ClienteScreen } from './screens/ClienteScreen';
import { ConfirmacaoScreen } from './screens/ConfirmacaoScreen';
import type { CoberturaFormData } from './context/CoberturaContext';
import type { ClienteFormData } from './screens/ClienteScreen';

export type Screen = 'home' | 'cobertura' | 'cliente' | 'confirmacao';

const NOME_ORCAMENTO_COBERTURA = 'Cobertura Premium';

function AppContent() {
  const [screen, setScreen] = useState<Screen>('home');
  const [confirmacaoData, setConfirmacaoData] = useState<CoberturaFormData | null>(null);
  const [clienteData, setClienteData] = useState<ClienteFormData | null>(null);
  const { reset } = useCobertura();

  const goHome = () => {
    setScreen('home');
    setConfirmacaoData(null);
    setClienteData(null);
  };

  const goToCobertura = () => {
    reset();
    setScreen('cobertura');
  };

  const goToCliente = (data: CoberturaFormData) => {
    setConfirmacaoData(data);
    setScreen('cliente');
  };

  const goToConfirmacao = (data: ClienteFormData) => {
    setClienteData(data);
    setScreen('confirmacao');
  };

  return (
    <div className="h-full flex flex-col bg-dark-bg text-white overflow-hidden">
      <header className="flex-shrink-0 sticky top-0 z-50 bg-[var(--color-bg)]">
        <TitleBar />
      </header>
      <div className="flex-1 min-h-0 overflow-y-auto">
      {screen === 'home' && (
        <HomeScreen onCoberturaPremium={goToCobertura} />
      )}
      {screen === 'cobertura' && (
        <CoberturaPremiumScreen onBack={goHome} onConfirm={goToCliente} />
      )}
      {screen === 'cliente' && (
        <ClienteScreen
          nomeOrcamento={NOME_ORCAMENTO_COBERTURA}
          onBack={() => setScreen('cobertura')}
          onConfirm={goToConfirmacao}
        />
      )}
      {screen === 'confirmacao' && confirmacaoData && clienteData && (
        <ConfirmacaoScreen data={confirmacaoData} clienteData={clienteData} onBack={goHome} />
      )}
      </div>
    </div>
  );
}

function App() {
  return (
    <CoberturaProvider>
      <AppContent />
    </CoberturaProvider>
  );
}

export default App;

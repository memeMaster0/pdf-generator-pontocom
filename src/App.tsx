import { useState } from 'react';
import { CoberturaProvider, useCobertura } from './context/CoberturaContext';
import { PergoladoProvider, usePergolado } from './context/PergoladoContext';
import { CoberturaRetratilProvider, useCoberturaRetratil } from './context/CoberturaRetratilContext';
import { PortaProvider, usePorta } from './context/PortaContext';
import { TitleBar } from './components/TitleBar';
import { HomeScreen } from './screens/HomeScreen';
import { CoberturaPremiumScreen } from './screens/CoberturaPremiumScreen';
import { PergoladoScreen } from './screens/PergoladoScreen';
import { CoberturaRetratilScreen } from './screens/CoberturaRetratilScreen';
import { PortaScreen } from './screens/PortaScreen';
import { ClienteScreen } from './screens/ClienteScreen';
import { ConfirmacaoScreen } from './screens/ConfirmacaoScreen';
import type { CoberturaFormData } from './context/CoberturaContext';
import type { PergoladoFormData } from './context/PergoladoContext';
import type { CoberturaRetratilFormData } from './context/CoberturaRetratilContext';
import type { PortaFormData } from './context/PortaContext';
import type { ClienteFormData } from './screens/ClienteScreen';

export type Screen = 'home' | 'cobertura' | 'pergolado' | 'cobertura_retratil' | 'porta' | 'cliente' | 'confirmacao';

export type TipoOrcamento = 'cobertura' | 'pergolado' | 'cobertura_retratil' | 'porta';

const NOME_ORCAMENTO_COBERTURA = 'Cobertura Premium';
const NOME_ORCAMENTO_PERGOLADO = 'Pergolado';
const NOME_ORCAMENTO_COBERTURA_RETRATIL = 'Cobertura Retrátil';
const NOME_ORCAMENTO_PORTA = 'Porta';

function AppContent() {
  const [screen, setScreen] = useState<Screen>('home');
  const [tipoOrcamento, setTipoOrcamento] = useState<TipoOrcamento | null>(null);
  const [confirmacaoData, setConfirmacaoData] = useState<
    CoberturaFormData | PergoladoFormData | CoberturaRetratilFormData | PortaFormData | null
  >(null);
  const [clienteData, setClienteData] = useState<ClienteFormData | null>(null);
  const { reset: resetCobertura } = useCobertura();
  const { reset: resetPergolado } = usePergolado();
  const { reset: resetCoberturaRetratil } = useCoberturaRetratil();
  const { reset: resetPorta } = usePorta();

  const goHome = () => {
    setScreen('home');
    setTipoOrcamento(null);
    setConfirmacaoData(null);
    setClienteData(null);
  };

  const goToCobertura = () => {
    resetCobertura();
    setTipoOrcamento('cobertura');
    setScreen('cobertura');
  };

  const goToPergolado = () => {
    resetPergolado();
    setTipoOrcamento('pergolado');
    setScreen('pergolado');
  };

  const goToCoberturaRetratil = () => {
    resetCoberturaRetratil();
    setTipoOrcamento('cobertura_retratil');
    setScreen('cobertura_retratil');
  };

  const goToPorta = () => {
    resetPorta();
    setTipoOrcamento('porta');
    setScreen('porta');
  };

  const goToCliente = (
    data: CoberturaFormData | PergoladoFormData | CoberturaRetratilFormData | PortaFormData
  ) => {
    setConfirmacaoData(data);
    setScreen('cliente');
  };

  const goToConfirmacao = (data: ClienteFormData) => {
    setClienteData(data);
    setScreen('confirmacao');
  };

  const nomeOrcamento =
    tipoOrcamento === 'pergolado'
      ? NOME_ORCAMENTO_PERGOLADO
      : tipoOrcamento === 'cobertura_retratil'
        ? NOME_ORCAMENTO_COBERTURA_RETRATIL
        : tipoOrcamento === 'porta'
          ? NOME_ORCAMENTO_PORTA
          : NOME_ORCAMENTO_COBERTURA;

  const backFromCliente = () => {
    if (tipoOrcamento === 'pergolado') setScreen('pergolado');
    else if (tipoOrcamento === 'cobertura_retratil') setScreen('cobertura_retratil');
    else if (tipoOrcamento === 'porta') setScreen('porta');
    else setScreen('cobertura');
  };

  return (
    <div className="h-full flex flex-col bg-dark-bg text-white overflow-hidden">
      <header className="flex-shrink-0 sticky top-0 z-50 bg-[var(--color-bg)]">
        <TitleBar />
      </header>
      <div className="flex-1 min-h-0 overflow-y-auto">
        {screen === 'home' && (
          <HomeScreen
            onCoberturaPremium={goToCobertura}
            onPergolado={goToPergolado}
            onCoberturaRetratil={goToCoberturaRetratil}
            onPorta={goToPorta}
          />
        )}
        {screen === 'cobertura' && (
          <CoberturaPremiumScreen onBack={goHome} onConfirm={(d) => goToCliente(d)} />
        )}
        {screen === 'pergolado' && (
          <PergoladoScreen onBack={goHome} onConfirm={(d) => goToCliente(d)} />
        )}
        {screen === 'cobertura_retratil' && (
          <CoberturaRetratilScreen onBack={goHome} onConfirm={(d) => goToCliente(d)} />
        )}
        {screen === 'porta' && (
          <PortaScreen onBack={goHome} onConfirm={(d) => goToCliente(d)} />
        )}
        {screen === 'cliente' && (
          <ClienteScreen
            nomeOrcamento={nomeOrcamento}
            onBack={backFromCliente}
            onConfirm={goToConfirmacao}
          />
        )}
        {screen === 'confirmacao' &&
          confirmacaoData &&
          clienteData &&
          tipoOrcamento && (
            <ConfirmacaoScreen
              data={confirmacaoData}
              tipoOrcamento={tipoOrcamento}
              clienteData={clienteData}
              onBack={goHome}
            />
          )}
      </div>
    </div>
  );
}

function App() {
  return (
    <CoberturaProvider>
      <PergoladoProvider>
        <CoberturaRetratilProvider>
          <PortaProvider>
            <AppContent />
          </PortaProvider>
        </CoberturaRetratilProvider>
      </PergoladoProvider>
    </CoberturaProvider>
  );
}

export default App;

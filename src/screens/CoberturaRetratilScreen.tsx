import { useCoberturaRetratil } from '../context/CoberturaRetratilContext';
import type { CoberturaRetratilFormData } from '../context/CoberturaRetratilContext';
import { StepButtons } from '../components/StepButtons';
import { CurrencyInput } from '../components/CurrencyInput';
import { MedidasInput, validateMedidas } from '../components/MedidasInput';

interface CoberturaRetratilScreenProps {
  onBack: () => void;
  onConfirm: (data: CoberturaRetratilFormData) => void;
}

export function CoberturaRetratilScreen({ onBack, onConfirm }: CoberturaRetratilScreenProps) {
  const {
    step1,
    step2,
    step3,
    step4,
    step5,
    corEstruturaOutra,
    medidas,
    valorM2,
    custoAberturaAutomatizada,
    custoDeslocamento,
    setStep1,
    setStep2,
    setStep3,
    setStep4,
    setStep5,
    setCorEstruturaOutra,
    setMedidas,
    setValorM2,
    setCustoAberturaAutomatizada,
    setCustoDeslocamento,
    canShowForm,
    buildFormData,
    formTouched,
    setFormTouched,
  } = useCoberturaRetratil();

  const isPolicarbonato =
    step1 === 'Policarbonato Compacto 3mm' || step1 === 'Policarbonato Alveolar 6mm';

  const handleSubmit = () => {
    setFormTouched(true);
    if (!canShowForm || !step1 || !step5) return;

    const data = buildFormData();
    if (!data) return;

    const okMedidas = validateMedidas(medidas);
    const okValorM2 = valorM2.length > 0 && parseInt(valorM2, 10) > 0;
    const okDeslocamento = custoDeslocamento.length > 0 && parseInt(custoDeslocamento, 10) >= 0;
    const okAbertura =
      step5 !== 'Automatizada' ||
      (custoAberturaAutomatizada.length > 0 && parseInt(custoAberturaAutomatizada, 10) >= 0);

    if (!okMedidas || !okValorM2 || !okDeslocamento || !okAbertura) return;

    onConfirm(data);
  };

  const canSubmitForm =
    validateMedidas(medidas) &&
    valorM2.length > 0 &&
    parseInt(valorM2, 10) > 0 &&
    custoDeslocamento.length > 0 &&
    parseInt(custoDeslocamento, 10) >= 0 &&
    (step5 !== 'Automatizada' ||
      (custoAberturaAutomatizada.length > 0 && parseInt(custoAberturaAutomatizada, 10) >= 0));

  return (
    <div className="min-h-full flex flex-col px-6 py-8 max-w-2xl mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="self-start text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-8"
      >
        ← Voltar
      </button>

      <h2 className="text-xl font-semibold text-white mb-1">Cobertura Retrátil</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-2">Dados do orçamento</p>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        Preencha as opções na ordem e depois os dados do orçamento.
      </p>

      {/* Step 1: Tipo de Cobertura */}
      <div className="mb-8">
        <p className="text-sm font-medium text-white mb-3">1. Tipo de Cobertura</p>
        <StepButtons
          options={[
            { value: 'Telha Térmica', label: 'Telha Térmica' },
            { value: 'Policarbonato Compacto 3mm', label: 'Policarbonato Compacto 3mm' },
            { value: 'Policarbonato Alveolar 6mm', label: 'Policarbonato Alveolar 6mm' },
          ]}
          value={step1}
          onChange={(v) => setStep1(v as typeof step1)}
        />
      </div>

      {/* Steps 2–4 só para Telha Térmica; Policarbonato pula direto para Modo de Abertura */}
      {step1 === 'Telha Térmica' && (
        <>
          {/* Step 2: Cor da Parte Superior */}
          <div className="mb-8">
            <p className="text-sm font-medium text-white mb-3">2. Cor da Parte Superior</p>
            <StepButtons
              options={[
                { value: 'Natural', label: 'Natural' },
                { value: 'Preta', label: 'Preta' },
              ]}
              value={step2}
              onChange={(v) => setStep2(v as typeof step2)}
            />
          </div>

          {/* Step 3: Cor da Parte Inferior */}
          <div className="mb-8">
            <p className="text-sm font-medium text-white mb-3">3. Cor da Parte Inferior</p>
            <StepButtons
              options={[
                { value: 'Amadeirado', label: 'Amadeirado' },
                { value: 'Branco', label: 'Branco' },
                { value: 'Preto', label: 'Preto' },
              ]}
              value={step3}
              onChange={(v) => setStep3(v as typeof step3)}
              disabled={step2 === null}
            />
          </div>

          {/* Step 4: Cor da Estrutura */}
          <div className="mb-8">
            <p className="text-sm font-medium text-white mb-3">4. Cor da Estrutura</p>
            <StepButtons
              options={[
                { value: 'Preto', label: 'Preto' },
                { value: 'Branca', label: 'Branca' },
                { value: 'Outra', label: 'Outra' },
              ]}
              value={step4}
              onChange={(v) => setStep4(v as typeof step4)}
              disabled={step3 === null}
            />
            {step4 === 'Outra' && (
              <div className="mt-4">
                <label
                  htmlFor="cor-estrutura-outra"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Especifique a cor
                </label>
                <input
                  id="cor-estrutura-outra"
                  type="text"
                  value={corEstruturaOutra}
                  onChange={(e) => setCorEstruturaOutra(e.target.value)}
                  placeholder="ex: cinza"
                  className="w-full py-3 px-4 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                  aria-invalid={formTouched && step4 === 'Outra' && !corEstruturaOutra.trim()}
                />
                {formTouched && step4 === 'Outra' && !corEstruturaOutra.trim() && (
                  <p className="mt-1 text-xs text-amber-400">Informe a cor da estrutura.</p>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Step 5: Modo de Abertura (única pergunta extra quando Policarbonato; sempre última quando Telha Térmica) */}
      <div className="mb-8">
        <p className="text-sm font-medium text-white mb-3">
          {isPolicarbonato ? '2. Modo de Abertura' : '5. Modo de Abertura'}
        </p>
        <StepButtons
          options={[
            { value: 'Manual', label: 'Manual' },
            { value: 'Automatizada', label: 'Automatizada' },
          ]}
          value={step5}
          onChange={(v) => setStep5(v as typeof step5)}
          disabled={
            step1 === null ||
            (step1 === 'Telha Térmica' &&
              (step4 === null || (step4 === 'Outra' && !corEstruturaOutra.trim())))
          }
        />
      </div>

      {/* Form - only when all 5 steps done */}
      {canShowForm && (
        <div className="space-y-6 pt-4 border-t border-[var(--color-border)]">
          <h3 className="text-lg font-medium text-white">Dados do orçamento</h3>

          <MedidasInput
            id="medidas"
            label="Medidas"
            value={medidas}
            onChange={setMedidas}
            placeholder="5,00m x 2,00m"
            hint="5,00m x 2,00m"
            error={
              formTouched && !validateMedidas(medidas)
                ? 'Use o formato: 5,00m x 2,00m'
                : undefined
            }
          />

          <CurrencyInput
            id="valor-m2"
            label="Valor por m²"
            value={valorM2}
            onChange={setValorM2}
            placeholder="1.500,00"
            hint="R$ 1.500,00"
          />

          {step5 === 'Automatizada' && (
            <CurrencyInput
              id="custo-abertura"
              label="Custo da Abertura Automatizada"
              value={custoAberturaAutomatizada}
              onChange={setCustoAberturaAutomatizada}
              placeholder="0,00"
              hint="R$ 0,00"
            />
          )}

          <CurrencyInput
            id="custo-deslocamento"
            label="Custo de Deslocamento"
            value={custoDeslocamento}
            onChange={setCustoDeslocamento}
            placeholder="0,00"
            hint="R$ 200,00"
            suffix={
              <button
                type="button"
                onClick={() => setCustoDeslocamento('0')}
                className="shrink-0 self-stretch flex items-center px-4 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm font-medium transition-colors"
              >
                Sem custo
              </button>
            }
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmitForm}
            className="w-full py-4 rounded-[var(--radius-lg)] font-medium bg-[var(--color-accent)] text-[#0d0d0d] hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-accent)] transition-all"
          >
            Continuar
          </button>
        </div>
      )}

      {!canShowForm && (
        <p className="text-sm text-[var(--color-text-muted)] mt-4">
          Selecione todas as opções acima para exibir o formulário.
        </p>
      )}
    </div>
  );
}

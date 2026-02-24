import { useEffect } from 'react';
import { useCobertura } from '../context/CoberturaContext';
import type { CoberturaFormData } from '../context/CoberturaContext';
import { StepButtons } from '../components/StepButtons';
import { CurrencyInput } from '../components/CurrencyInput';
import { MedidasInput, validateMedidas } from '../components/MedidasInput';

interface CoberturaPremiumScreenProps {
  onBack: () => void;
  onConfirm: (data: CoberturaFormData) => void;
}

const CORES_ACM = [
  { value: 'Preto', label: 'Cor: Preto' },
  { value: 'Branco', label: 'Cor: Branco' },
  { value: 'Cinza', label: 'Cor: Cinza' },
] as const;

export function CoberturaPremiumScreen({ onBack, onConfirm }: CoberturaPremiumScreenProps) {
  const {
    step1,
    step2,
    step3,
    step4,
    step5,
    tipoMedidas,
    medidas,
    medidas1,
    medidas2,
    valorM2,
    valorPilar,
    medidaPilar,
    custoDeslocamento,
    setStep1,
    setStep2,
    setStep3,
    setStep4,
    setStep5,
    setTipoMedidas,
    setMedidas,
    setMedidas1,
    setMedidas2,
    setValorM2,
    setValorPilar,
    setMedidaPilar,
    setCustoDeslocamento,
    canShowForm,
    buildFormData,
    formTouched,
    setFormTouched,
  } = useCobertura();

  const isChapa = step1 === 'Chapa Metálica';

  useEffect(() => {
    if (!step2) return;
    if (isChapa && step3 !== 'Pintura Automotiva Premium') {
      setStep3('Pintura Automotiva Premium');
    }
    if (!isChapa && step3 === null) {
      setStep3('Preto');
    }
  }, [isChapa, step2, step3, setStep3]);

  const handleSubmit = () => {
    setFormTouched(true);
    if (!canShowForm || !step1 || !step2 || !step3 || !step4 || !step5) return;

    const okMedidas =
      tipoMedidas === 'area_unica'
        ? validateMedidas(medidas)
        : validateMedidas(medidas1) && validateMedidas(medidas2);
    const okValorM2 = valorM2.length > 0 && parseInt(valorM2, 10) > 0;
    const okPilar = step2 !== 'Sim' || (valorPilar.length > 0 && parseInt(valorPilar, 10) >= 0);
    const okMedidaPilar = step2 !== 'Sim' || medidaPilar.trim().length > 0;
    const okDeslocamento = custoDeslocamento.length > 0 && parseInt(custoDeslocamento, 10) >= 0;

    if (!okMedidas || !okValorM2 || !okPilar || !okMedidaPilar || !okDeslocamento) return;

    const data = buildFormData();
    if (data) onConfirm(data);
  };

  const canSubmitForm =
    (tipoMedidas === 'area_unica' ? validateMedidas(medidas) : validateMedidas(medidas1) && validateMedidas(medidas2)) &&
    valorM2.length > 0 &&
    parseInt(valorM2, 10) > 0 &&
    (step2 !== 'Sim' || (valorPilar.length > 0 && parseInt(valorPilar, 10) >= 0)) &&
    (step2 !== 'Sim' || medidaPilar.trim().length > 0) &&
    custoDeslocamento.length > 0 &&
    parseInt(custoDeslocamento, 10) >= 0;

  return (
    <div className="min-h-full flex flex-col px-6 py-8 max-w-2xl mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="self-start text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-8"
      >
        ← Voltar
      </button>

      <h2 className="text-xl font-semibold text-white mb-1">Cobertura Premium</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-2">
        Dados do orçamento
      </p>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        Preencha as opções na ordem e depois os dados do orçamento.
      </p>

      {/* Step 1 */}
      <div className="mb-8">
        <p className="text-sm font-medium text-white mb-3">1. Tipo de Cobertura</p>
        <StepButtons
          options={[
            { value: 'ACM', label: 'ACM' },
            { value: 'Chapa Metálica', label: 'Chapa Metálica' },
          ]}
          value={step1}
          onChange={(v) => setStep1(v as 'ACM' | 'Chapa Metálica')}
        />
      </div>

      {/* Step 2 */}
      <div className="mb-8">
        <p className="text-sm font-medium text-white mb-3">2. Tem Pilar</p>
        <StepButtons
          options={[
            { value: 'Sim', label: 'Sim' },
            { value: 'Não', label: 'Não' },
          ]}
          value={step2}
          onChange={(v) => setStep2(v as 'Sim' | 'Não')}
          disabled={step1 === null}
        />
      </div>

      {/* Step 3 */}
      <div className="mb-8">
        <p className="text-sm font-medium text-white mb-3">3. Cor / Pintura</p>
        {isChapa ? (
          <div className="py-3 px-5 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]">
            Pintura Automotiva Premium
          </div>
        ) : (
          <StepButtons
            options={[...CORES_ACM]}
            value={step3 as 'Preto' | 'Branco' | 'Cinza' | null}
            onChange={(v) => setStep3(v)}
            disabled={step2 === null}
          />
        )}
      </div>

      {/* Step 4 */}
      <div className="mb-8">
        <p className="text-sm font-medium text-white mb-3">4. Telha Térmica</p>
        <StepButtons
          options={[
            { value: '30mm', label: '30mm' },
            { value: '50mm', label: '50mm' },
          ]}
          value={step4}
          onChange={(v) => setStep4(v as '30mm' | '50mm')}
          disabled={step3 === null}
        />
      </div>

      {/* Step 5 */}
      <div className="mb-8">
        <p className="text-sm font-medium text-white mb-3">5. Forro PVC</p>
        <StepButtons
          options={[
            { value: 'Tradicional', label: 'Tradicional' },
            { value: 'Vinílico', label: 'Vinílico' },
          ]}
          value={step5}
          onChange={(v) => setStep5(v as 'Tradicional' | 'Vinílico')}
          disabled={step4 === null}
        />
      </div>

      {/* Form - only when all 5 steps done */}
      {canShowForm && (
        <div className="space-y-6 pt-4 border-t border-[var(--color-border)]">
          <h3 className="text-lg font-medium text-white">Dados do orçamento</h3>

          <div>
            <p className="text-sm font-medium text-white mb-3">Tipo de medição</p>
            <StepButtons
              options={[
                { value: 'area_unica', label: 'Área única' },
                { value: 'duas_areas', label: 'Duas áreas' },
              ]}
              value={tipoMedidas}
              onChange={(v) => setTipoMedidas(v as typeof tipoMedidas)}
            />
          </div>

          {tipoMedidas === 'area_unica' ? (
            <MedidasInput
              id="medidas"
              label="Medidas da cobertura"
              value={medidas}
              onChange={setMedidas}
              placeholder="5,00m x 2,00m"
              hint="5,00m x 2,00m"
              error={undefined}
            />
          ) : (
            <>
              <MedidasInput
                id="medidas1"
                label="Área 1 (medidas)"
                value={medidas1}
                onChange={setMedidas1}
                placeholder="5,00m x 2,00m"
                hint="5,00m x 2,00m"
                error={undefined}
              />
              <MedidasInput
                id="medidas2"
                label="Área 2 (medidas)"
                value={medidas2}
                onChange={setMedidas2}
                placeholder="3,00m x 4,00m"
                hint="3,00m x 4,00m"
                error={undefined}
              />
            </>
          )}

          <CurrencyInput
            id="valor-m2"
            label="Valor por m²"
            value={valorM2}
            onChange={setValorM2}
            placeholder="1.500,00"
            hint="R$ 1.500,00"
          />

          {step2 === 'Sim' && (
            <>
              <CurrencyInput
                id="valor-pilar"
                label="Valor do Pilar"
                value={valorPilar}
                onChange={setValorPilar}
                placeholder="0,00"
                hint="R$ 1.500,00"
              />
              <div>
                <label htmlFor="medida-pilar" className="block text-sm font-medium text-white mb-2">
                  Medida do Pilar
                </label>
                <input
                  id="medida-pilar"
                  type="text"
                  value={medidaPilar}
                  onChange={(e) => setMedidaPilar(e.target.value)}
                  placeholder="ex: 100x100"
                  className="w-full py-3 px-4 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                  aria-invalid={formTouched && !medidaPilar.trim()}
                  aria-describedby={formTouched && !medidaPilar.trim() ? 'medida-pilar-error' : undefined}
                />
                {formTouched && !medidaPilar.trim() ? (
                  <p id="medida-pilar-error" className="mt-1 text-xs text-amber-400">Informe a medida do pilar (ex.: 100x100)</p>
                ) : (
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">Ex.: 100x100</p>
                )}
              </div>
            </>
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

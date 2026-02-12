import { useState } from 'react';
import {
  formatarCpfCnpj,
  formatarTelefone,
  capitalize,
  validarCpfCnpj,
  validarTelefone,
} from '../utils/formatadores';

export interface ClienteFormData {
  nome: string;
  cpfCnpj: string;
  cidade: string;
  celularFone: string;
  endereco: string;
}

const INPUT_CLASS =
  'w-full py-3 px-4 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent';

interface ClienteScreenProps {
  nomeOrcamento: string;
  onBack: () => void;
  onConfirm: (data: ClienteFormData) => void;
}

export function ClienteScreen({ nomeOrcamento, onBack, onConfirm }: ClienteScreenProps) {
  const [formTouched, setFormTouched] = useState(false);
  const [nome, setNome] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [cidade, setCidade] = useState('');
  const [celularFone, setCelularFone] = useState('');
  const [endereco, setEndereco] = useState('');

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value);
  const handleNomeBlur = () => setNome((v) => capitalize(v));

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => setCpfCnpj(formatarCpfCnpj(e.target.value));

  const handleCidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => setCidade(e.target.value);
  const handleCidadeBlur = () => setCidade((v) => capitalize(v));

  const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => setCelularFone(formatarTelefone(e.target.value));

  const okNome = nome.trim().length > 0;
  const okCpfCnpj = !cpfCnpj.trim() || validarCpfCnpj(cpfCnpj); // vazio = ok; se preenchido, deve ser válido
  const okCidade = cidade.trim().length > 0;
  const okCelular = validarTelefone(celularFone);
  const okEndereco = endereco.trim().length > 0;

  const canSubmit = okNome && okCpfCnpj && okCidade && okCelular && okEndereco;

  const handleSubmit = () => {
    setFormTouched(true);
    if (!canSubmit) return;
    onConfirm({
      nome: capitalize(nome),
      cpfCnpj,
      cidade: capitalize(cidade),
      celularFone,
      endereco: endereco.trim(),
    });
  };

  return (
    <div className="min-h-full flex flex-col px-6 py-8 max-w-2xl mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="self-start text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-8"
      >
        ← Voltar
      </button>

      <h2 className="text-xl font-semibold text-white mb-1">{nomeOrcamento}</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        Informações do cliente
      </p>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="cliente-nome" className="block text-sm font-medium text-white mb-2">
              Nome
            </label>
            <input
              id="cliente-nome"
              type="text"
              value={nome}
              onChange={handleNomeChange}
              onBlur={handleNomeBlur}
              placeholder="Nome completo"
              className={INPUT_CLASS}
              aria-invalid={formTouched && !okNome}
            />
            {formTouched && !okNome && (
              <p className="mt-1 text-xs text-amber-400">Preencha o nome</p>
            )}
          </div>
          <div>
            <label htmlFor="cliente-cidade" className="block text-sm font-medium text-white mb-2">
              Cidade
            </label>
            <input
              id="cliente-cidade"
              type="text"
              value={cidade}
              onChange={handleCidadeChange}
              onBlur={handleCidadeBlur}
              placeholder="Cidade"
              className={INPUT_CLASS}
              aria-invalid={formTouched && !okCidade}
            />
            {formTouched && !okCidade && (
              <p className="mt-1 text-xs text-amber-400">Preencha a cidade</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="cliente-cpfcnpj" className="block text-sm font-medium text-white mb-2">
              CPF/CNPJ <span className="text-[var(--color-text-muted)] font-normal">(opcional)</span>
            </label>
            <input
              id="cliente-cpfcnpj"
              type="text"
              value={cpfCnpj}
              onChange={handleCpfCnpjChange}
              placeholder="000.000.000-00 ou CNPJ"
              className={INPUT_CLASS}
              aria-invalid={formTouched && !okCpfCnpj}
            />
            {formTouched && !okCpfCnpj && (
              <p className="mt-1 text-xs text-amber-400">Se informado: CPF (11 dígitos) ou CNPJ (14 dígitos)</p>
            )}
          </div>
          <div>
            <label htmlFor="cliente-celular" className="block text-sm font-medium text-white mb-2">
              Celular/Fone
            </label>
            <input
              id="cliente-celular"
              type="text"
              value={celularFone}
              onChange={handleCelularChange}
              placeholder="(00) 00000-0000"
              className={INPUT_CLASS}
              aria-invalid={formTouched && !okCelular}
            />
            {formTouched && !okCelular && (
              <p className="mt-1 text-xs text-amber-400">Telefone com 10 ou 11 dígitos</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="cliente-endereco" className="block text-sm font-medium text-white mb-2">
            Endereço
          </label>
          <input
            id="cliente-endereco"
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Endereço completo"
            className={INPUT_CLASS}
            aria-invalid={formTouched && !okEndereco}
          />
          {formTouched && !okEndereco && (
            <p className="mt-1 text-xs text-amber-400">Preencha o endereço</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-4 rounded-[var(--radius-lg)] font-medium bg-[var(--color-accent)] text-[#0d0d0d] hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-accent)] transition-all"
        >
          Continuar para resumo
        </button>
      </div>
    </div>
  );
}

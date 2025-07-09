import React from "react";
import { useFormContext } from "react-hook-form";

const LBODebtAssumptions = ({
  setCurrScreen,
  usingRevolver,
  setUsingRevolver,
  usingUnitranche,
  setUsingUnitranche,
}) => {
  const { register } = useFormContext();

  return (
    <div>
      <style>
        {`
          /* Hide number input spinners for all browsers */
          input[type=number]::-webkit-inner-spin-button,
          input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type=number] {
            -moz-appearance: textfield;
          }
        `}
      </style>
      <div className="flex justify-center text-bold my-4">
        Debt Assumptions
      </div>
      <div className="w-full flex justify-center">
        <div className="grid grid-cols-6 gap-x-6 gap-y-4">
          <div className="text-xs font-semibold text-center"></div>
          <div className="text-xs font-semibold text-center">Int. Rate</div>
          <div className="text-xs font-semibold text-center">Floor</div>
          <div className="text-xs font-semibold text-center">% Amort</div>
          <div className="text-xs font-semibold text-center">% Sweep</div>
          <div className="text-xs font-semibold text-center">EBITDA</div>
          {/* Revolver row */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => setUsingRevolver((prev) => !prev)}
              className={`w-40 text-xs font-semibold ${
                usingRevolver ? "border-green-400" : "border-red-400"
              } border-l-[1px] hover:bg-[#424242] p-2 rounded-r-md transition-all duration-200`}
            >
              Revolver
            </button>
          </div>
          <input
            {...register("revolver_int_rate", { valueAsNumber: true })}
            type="number"
            disabled={!usingRevolver}
            placeholder="0.0"
            className="appearance-none w-24 rounded-full bg-[#D9D9D9] p-2 text-black focus:outline-none focus:ring-0 text-xs text-center"
            style={{ MozAppearance: 'textfield' }}
            onWheel={e => e.target.blur()}
          />
          <input
            {...register("revolver_floor", { valueAsNumber: true })}
            type="number"
            disabled={!usingRevolver}
            placeholder="0.0"
            className="appearance-none w-24 rounded-full bg-[#D9D9D9] p-2 text-black focus:outline-none focus:ring-0 text-xs text-center"
            style={{ MozAppearance: 'textfield' }}
            onWheel={e => e.target.blur()}
          />
          <input
            {...register("revolver_amortization", { valueAsNumber: true })}
            type="number"
            disabled={!usingRevolver}
            placeholder="0.0"
            className="appearance-none w-24 rounded-full bg-[#D9D9D9] p-2 text-black focus:outline-none focus:ring-0 text-xs text-center"
            style={{ MozAppearance: 'textfield' }}
            onWheel={e => e.target.blur()}
          />
          <input
            {...register("revolver_sweep_rate", { valueAsNumber: true })}
            type="number"
            disabled={!usingRevolver}
            placeholder="0.0"
            className="appearance-none w-24 rounded-full bg-[#D9D9D9] p-2 text-black focus:outline-none focus:ring-0 text-xs text-center"
            style={{ MozAppearance: 'textfield' }}
            onWheel={e => e.target.blur()}
          />
          <input
            {...register("revolver_xebitda_multiple", { valueAsNumber: true })}
            type="number"
            disabled={!usingRevolver}
            placeholder="0.0"
            className="appearance-none w-24 rounded-full bg-[#D9D9D9] p-2 text-black focus:outline-none focus:ring-0 text-xs text-center"
            style={{ MozAppearance: 'textfield' }}
            onWheel={e => e.target.blur()}
          />
          {/* Unitranche row */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => setUsingUnitranche((prev) => !prev)}
              className={`w-40 text-xs font-semibold ${
                usingUnitranche ? "border-green-400" : "border-red-400"
              } border-l-[1px] hover:bg-[#424242] p-2 rounded-r-md transition-all duration-200`}
            >
              Unitranche Term Loan
            </button>
          </div>
          <input
            {...register("unitranche_term_loan_int_rate", { valueAsNumber: true })}
            type="number"
            disabled={!usingUnitranche}
            placeholder="0.0"
            className="appearance-none w-24 rounded-full bg-[#D9D9D9] p-2 text-black focus:outline-none focus:ring-0 text-xs text-center"
            style={{ MozAppearance: 'textfield' }}
            onWheel={e => e.target.blur()}
          />
          <input
            {...register("unitranche_term_loan_floor", { valueAsNumber: true })}
            type="number"
            disabled={!usingUnitranche}
            placeholder="0.0"
            className="appearance-none w-24 rounded-full bg-[#D9D9D9] p-2 text-black focus:outline-none focus:ring-0 text-xs text-center"
            style={{ MozAppearance: 'textfield' }}
            onWheel={e => e.target.blur()}
          />
          <input
            {...register("unitranche_term_loan_amortization", { valueAsNumber: true })}
            type="number"
            disabled={!usingUnitranche}
            placeholder="0.0"
            className="appearance-none w-24 rounded-full bg-[#D9D9D9] p-2 text-black focus:outline-none focus:ring-0 text-xs text-center"
            style={{ MozAppearance: 'textfield' }}
            onWheel={e => e.target.blur()}
          />
          <input
            {...register("unitranche_term_loan_sweep_rate", { valueAsNumber: true })}
            type="number"
            disabled={!usingUnitranche}
            placeholder="0.0"
            className="appearance-none w-24 rounded-full bg-[#D9D9D9] p-2 text-black focus:outline-none focus:ring-0 text-xs text-center"
            style={{ MozAppearance: 'textfield' }}
            onWheel={e => e.target.blur()}
          />
          <input
            {...register("unitranche_term_loan_xebitda_multiple", { valueAsNumber: true })}
            type="number"
            disabled={!usingUnitranche}
            placeholder="0.0"
            className="appearance-none w-24 rounded-full bg-[#D9D9D9] p-2 text-black focus:outline-none focus:ring-0 text-xs text-center"
            style={{ MozAppearance: 'textfield' }}
            onWheel={e => e.target.blur()}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setCurrScreen("basic")}
          className="rounded-full bg-[#A16BFB] m-8 mb-16 p-2 w-64 text-center text-white hover:brightness-110 transition-all transition-200"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default LBODebtAssumptions;

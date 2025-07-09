import React, { useState, useEffect, useRef } from "react";
import { Controller } from "react-hook-form";

/**
 * PercentInput
 * A reusable input for percentage values that stores as decimal in form state but displays as percent.
 *
 * Props:
 * - name: string (required) - field name for react-hook-form
 * - control: control object from useForm (required)
 * - onBlur: function (optional) - called on blur event
 * - ...props: any other props for <input>
 */
const PercentInput = ({ name, control, onBlur, ...props }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => {
      const [inputValue, setInputValue] = useState(
        field.value !== undefined && field.value !== null && field.value !== ""
          ? (parseFloat(field.value) * 100).toString()
          : ""
      );
      const debounceRef = useRef();

      // Update local state if form value changes externally
      useEffect(() => {
        const asPercent =
          field.value !== undefined && field.value !== null && field.value !== ""
            ? (parseFloat(field.value) * 100).toString()
            : "";
        setInputValue(asPercent);
      }, [field.value]);

      // Debounce updating the form state
      useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          if (inputValue === "") {
            field.onChange("");
          } else {
            const num = parseFloat(inputValue);
            if (!isNaN(num)) {
              if (num <= 1) {
                // User intends a decimal (e.g., 0.1 for 10%)
                field.onChange(num);
              } else {
                // User intends a percent (e.g., 10 for 10%)
                field.onChange(num / 100);
              }
            }
          }
        }, 500);
        return () => clearTimeout(debounceRef.current);
        // eslint-disable-next-line
      }, [inputValue]);

      return (
        <input
          {...field}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onBlur={e => {
            if (onBlur) onBlur(e);
          }}
          type="number"
          {...props}
        />
      );
    }}
  />
);

export default PercentInput;

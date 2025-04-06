import React, { useCallback, useRef } from "react";

export const InputOTP = ({
  children,
  value,
  onChange,
  maxLength,
}: {
  children: React.ReactNode;
  value: string;
  onChange: (val: string) => void;
  maxLength: number;
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (val: string, index: number) => {
    if (!/^\d?$/.test(val)) return;
    const otpArr = value.split("");
    otpArr[index] = val;
    const newOtp = otpArr.join("").padEnd(maxLength, "");
    onChange(newOtp);

    if (val && index < maxLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ✅ Fix: define ref callbacks in advance
  const getRefCallback = useCallback(
    (index: number) =>
      (el: HTMLInputElement | null) => {
        inputRefs.current[index] = el;
      },
    []
  );

  const clonedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    if (
      React.isValidElement<{ children?: React.ReactNode }>(child) &&
      child.type === InputOTPGroup
    ) {
      const groupChildren = React.Children.map(
        child.props.children,
        (slot, index) => {
          if (
            !React.isValidElement<{
              value?: string;
              onChange?: (
                e: React.ChangeEvent<HTMLInputElement>
              ) => void;
              onKeyDown?: (e: React.KeyboardEvent) => void;
              ref?: React.Ref<HTMLInputElement>;
            }>(slot)
          )
            return slot;

          return React.cloneElement(slot, {
            value: value[index] || "",
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              handleInput(e.target.value, index),
            onKeyDown: (e: React.KeyboardEvent) =>
              handleBackspace(e, index),
            ref: getRefCallback(index), // ✅ Use memoized callback
          });
        }
      );
      return <InputOTPGroup>{groupChildren}</InputOTPGroup>;
    }

    return child;
  });

  return <div>{clonedChildren}</div>;
};

export const InputOTPGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-2">{children}</div>
);

export const InputOTPSlot = React.forwardRef<
HTMLInputElement,
React.InputHTMLAttributes<HTMLInputElement> & { index: number }
>(({  ...props }, ref) => (
<input
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  maxLength={1}
  className="w-10 h-10 border text-center rounded-md text-lg"
  {...props}
  ref={ref}
/>
));


InputOTPSlot.displayName = "InputOTPSlot";

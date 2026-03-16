'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepInfo {
    number: number;
    title: string;
    description: string;
}

interface RFQStepperProps {
    steps: StepInfo[];
    currentStep: number;
    completedSteps: number[];
}

export function RFQStepper({ steps, currentStep, completedSteps }: RFQStepperProps) {
    return (
        <div className="w-full">
            {/* Mobile: compact progress bar */}
            <div className="sm:hidden mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                        Step {currentStep} of {steps.length}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {steps[currentStep - 1]?.title}
                    </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                    <div
                        className="bg-primary rounded-full h-2 transition-all duration-500"
                        style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Desktop: full stepper */}
            <div className="hidden sm:flex items-center justify-between mb-8">
                {steps.map((step, index) => {
                    const isComplete = completedSteps.includes(step.number);
                    const isCurrent = currentStep === step.number;
                    const isPast = currentStep > step.number;

                    return (
                        <div key={step.number} className="flex items-center flex-1">
                            {/* Step circle + label */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-semibold text-sm',
                                        isComplete || isPast
                                            ? 'bg-primary border-primary text-primary-foreground'
                                            : isCurrent
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-muted-foreground/30 text-muted-foreground'
                                    )}
                                >
                                    {isComplete || isPast ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        step.number
                                    )}
                                </div>
                                <div className="mt-2 text-center w-24">
                                    <p
                                        className={cn(
                                            'text-xs font-medium',
                                            isCurrent ? 'text-primary' : 'text-muted-foreground'
                                        )}
                                    >
                                        {step.title}
                                    </p>
                                </div>
                            </div>

                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        'flex-1 h-0.5 mx-2 mt-[-20px] transition-all duration-500',
                                        isPast || isComplete ? 'bg-primary' : 'bg-muted'
                                    )}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

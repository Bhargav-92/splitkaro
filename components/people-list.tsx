"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Users, Plus, Trash2, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BillFormValues } from "@/lib/validation";

interface PeopleListProps {
  form: UseFormReturn<BillFormValues>;
}

export function PeopleList({ form }: PeopleListProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "people",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-1">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50">
          <Users className="h-4 w-4 text-blue-600" />
        </div>
        <h2 className="text-base font-semibold text-slate-800">
          People Paying
        </h2>
        <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
          {fields.length}
        </span>
        <span className="ml-auto text-xs text-slate-400">
          Phone is optional — for WhatsApp sharing
        </span>
      </div>

      {errors.people?.root && (
        <p className="text-xs text-red-500" role="alert">
          {errors.people.root.message}
        </p>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-lg border border-slate-200 bg-slate-50/60 p-3"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xs font-bold text-slate-400 w-5">
                {index + 1}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Person {index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                aria-label={`Remove person ${index + 1}`}
                className="ml-auto h-6 w-6 text-slate-300 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {/* Name */}
              <div className="space-y-1">
                <Input
                  {...register(`people.${index}.name`)}
                  placeholder={`Name (e.g., Aarsh)`}
                  aria-label={`Person ${index + 1} name`}
                  aria-describedby={
                    errors.people?.[index]?.name
                      ? `person-${index}-name-error`
                      : undefined
                  }
                  aria-invalid={!!errors.people?.[index]?.name}
                />
                {errors.people?.[index]?.name && (
                  <p
                    id={`person-${index}-name-error`}
                    className="text-xs text-red-500"
                    role="alert"
                  >
                    {errors.people[index]?.name?.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400 text-xs font-medium select-none pointer-events-none">
                    <Phone className="h-3 w-3" />
                    +91
                  </span>
                  <Input
                    {...register(`people.${index}.phone`)}
                    placeholder="10-digit mobile"
                    type="tel"
                    maxLength={10}
                    className="pl-14"
                    aria-label={`Person ${index + 1} phone number`}
                    aria-describedby={
                      errors.people?.[index]?.phone
                        ? `person-${index}-phone-error`
                        : `person-${index}-phone-hint`
                    }
                    aria-invalid={!!errors.people?.[index]?.phone}
                  />
                </div>
                {errors.people?.[index]?.phone ? (
                  <p
                    id={`person-${index}-phone-error`}
                    className="text-xs text-red-500"
                    role="alert"
                  >
                    {errors.people[index]?.phone?.message}
                  </p>
                ) : (
                  <p
                    id={`person-${index}-phone-hint`}
                    className="text-xs text-slate-400"
                  >
                    Optional — to send QR via WhatsApp
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ name: "", phone: "" })}
        disabled={fields.length >= 50}
        className="w-full border-dashed border-slate-300 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50"
        aria-label="Add another person"
      >
        <Plus className="h-4 w-4" />
        Add another person
      </Button>

      {fields.length >= 50 && (
        <p className="text-xs text-amber-600 text-center">
          Maximum 50 people reached.
        </p>
      )}
    </div>
  );
}

// src/components/Form.jsx
import React from "react";

const Form = ({
  title,
  fields,
  onSubmit,
  submitText,
  titleClassName,
  buttonClassName,
  buttonHoverClassName,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2
        className={`text-xl font-semibold mb-4 ${
          titleClassName || "text-gray-800"
        }`}
      >
        {title}
      </h2>
      <form onSubmit={onSubmit}>
        {fields.map((field, index) => (
          <div className="mb-4" key={index}>
            <label
              htmlFor={field.name}
              className={`block text-sm font-medium ${
                field.labelClassName || "text-gray-700"
              }`}
            >
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                  field.inputClassName || ""
                }`}
                required={field.required}
              >
                <option value="">{field.placeholder}</option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                  field.inputClassName || ""
                }`}
                required={field.required}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className={`font-bold py-2 px-4 rounded-lg transition duration-300 ${
            buttonClassName || "bg-green-500 hover:bg-green-600"
          } ${buttonHoverClassName || "hover:bg-blue-600"} text-white`}
        >
          {submitText}
        </button>
      </form>
    </div>
  );
};

export default Form;

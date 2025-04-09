const convertToFormData = <T extends object>(data: T): FormData => {
  const keys = Object.keys(data);
  const formData = new FormData();

  for (const key of keys) {
    const value = data[key as keyof T];

    if (value === undefined || value === null) {
      continue;
    }

    switch (typeof value) {
      case "object":
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, JSON.stringify(value));
        }
        break;
      default:
        formData.append(key, value.toString());
        break;
    }
  }

  return formData;
};

export default convertToFormData;

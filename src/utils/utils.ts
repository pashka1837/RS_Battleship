export function createRegResponse(
  name: string,
  index: string,
  error = false,
  errorText = ""
) {
  const data = JSON.stringify({
    name,
    index,
    error,
    errorText,
  });
  const response = {
    type: "reg",
    data,
    id: 0,
  };
  return JSON.stringify(response);
}

export function createResponse(type: string, data: any, id = 0) {
  const jsonData = data && JSON.stringify(data);
  const response = {
    type,
    data: jsonData,
    id,
  };
  return JSON.stringify(response);
}

export const random = (x: number) => Math.floor(Math.random() * x);

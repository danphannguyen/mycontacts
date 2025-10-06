export async function handleRequestErrors(res) {
  const dataResponse = await res.json();

  if (!res.ok) {
    console.log("Response Error:", res);

    const errorDetails = Array.isArray(dataResponse.errors)
      ? dataResponse.errors.join("\n") // Chaque erreur sur une nouvelle ligne
      : "";

    // On combine le message principal et les détails
    const errorMessage = [dataResponse.message, errorDetails]
      .filter(Boolean)
      .join("\n");

    throw new Error(errorMessage || "Une erreur est survenue");
  }

  return dataResponse;
}

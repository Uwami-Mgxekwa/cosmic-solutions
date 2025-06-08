
export const getUsers = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    const content = await response.json();
    if (!response.ok) {
      return { ok: false, content };
    } else {
      return { ok: true, content };
    }
  } catch (error) {
    console.log(error);
  }

}

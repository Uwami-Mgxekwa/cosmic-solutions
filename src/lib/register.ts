export const register = async (url: string, data: any) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(() => { controller.abort() }, 60000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
      signal
    });

    const content = await response.json();
    clearTimeout(timeoutId)
    if (!response.ok) {
      return { ok: false, content };
    } else {
      return { ok: true, content };
    }
  } catch (error: any) {
    clearTimeout(timeoutId)
    console.log(error);
    let abort: boolean;
    console.log(error)
    if (error.name === 'AbortError') {
      abort = true
    } else {
      abort = false
    }
    return { ok: false, abort: abort, content: { message: error } }
  }
}

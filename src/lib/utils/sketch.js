export async function loadRandomSketch() {
    const randomId = Math.floor(Math.random() * 10);
    const response = await fetch(`/api/random-sketch/${randomId}`);
    return await response.json();
}

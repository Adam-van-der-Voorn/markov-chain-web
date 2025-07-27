const form = document.querySelector(".submit-url")

form.addEventListener("submit", handleSubmit)

async function handleSubmit(ev) {
    ev.preventDefault()
    // @ts-ignore
    const formData = new FormData(ev.target);
    const res = await fetch("/api/markov", {
        method: "POST",
        body: JSON.stringify({ url: formData.get('url') })
    })
    const j = await res.json()
    const id = j.id;

    const appendToParagraph = async () => {
        const getRes = await fetch("/api/markov/" + id)
        const j = await getRes.json()
        document.getElementById("paragraph-output")
            .innerText += j.p
    }
    appendToParagraph()
}
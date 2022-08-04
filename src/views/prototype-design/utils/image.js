import html2canvas from 'html2canvas';

export const getSnapShot = async (elementId) => {
    const snapShotElement = document.getElementById(elementId)
    if (!snapShotElement) return ''
    const canvas = await html2canvas(snapShotElement, {
        allowTaint: false,
        useCORS: true
    })
    const shot = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = shot
    a.download = "事例.png"
    a.click()
    return shot
}

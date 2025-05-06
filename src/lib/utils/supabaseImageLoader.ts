export function supabaseLoader({
    storage,
    src,
    width,
    quality,
}: {
    storage: string
    src: string
    width: number
    quality?: number
}) {
    return `https://sfobkvglrpnepbnnfzau.supabase.co/storage/v1/object/public/${storage}/${src}?width=${width}&quality=${quality ?? 75}`
}

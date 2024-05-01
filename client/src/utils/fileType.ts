export function fileType(type: string): 'text'|'image'|'audio'|'video' {
    let rtype: 'text'|'image'|'audio'|'video' = 'text';
    if (type.includes('image'))
        rtype = 'image';
    else if (type.includes('audio'))
        rtype = 'audio';
    else if (type.includes('video'))
        rtype = 'video';
    else if (type.includes('text'))
        rtype = 'text';

    return rtype;
}
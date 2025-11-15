export default function CharacterPage({
  params,
}: {
    params: { id: string };
}) {
    return <div>chatting with {params.id}</div>;
}

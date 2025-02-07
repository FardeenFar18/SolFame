export async function getStaticPaths() {
    return {
      paths: [{ params: { id: "1" } }, { params: { id: "2" } }],
      fallback: "blocking",  // or true/false
    };
  }
  
  export async function getStaticProps({ params }) {
    return {
      props: { id: params.id },
    };
  }
  
  export default function Page({ id }) {
    return <h1>Page ID: {id}</h1>;
  }
  
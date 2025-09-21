import Image from "next/image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

export default function Home() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <main className="flex-grow-1 d-flex flex-column justify-content-center align-items-center p-4 p-md-5">
        <Row className="w-100">
          <Col xs={12} className="text-center mb-5">
            <Image
              src="/next.svg"
              alt="Next.js logo"
              width={180}
              height={38}
              priority
            />
          </Col>
          <Col xs={12} md={8} className="mx-auto">
            <ol className="list-unstyled text-center text-md-start mb-4">
              <li className="mb-2">
                Get started by editing{" "}
                <code className="bg-light px-2 py-1 rounded">
                  app/page.tsx
                </code>
                .
              </li>
              <li>
                Save and see your changes instantly.
              </li>
            </ol>

            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-sm-start">
              <Button
                variant="dark"
                href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center gap-2"
              >
                <Image
                  src="/vercel.svg"
                  alt="Vercel logomark"
                  width={20}
                  height={20}
                />
                Deploy now
              </Button>
              <Button
                variant="outline-secondary"
                href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read our docs
              </Button>
            </div>
          </Col>
        </Row>
      </main>
      <footer className="d-flex gap-3 flex-wrap justify-content-center p-4">
        <a
          className="d-flex align-items-center gap-2 text-decoration-none"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="d-flex align-items-center gap-2 text-decoration-none"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="d-flex align-items-center gap-2 text-decoration-none"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}

import test from "node:test";
import assert from "node:assert/strict";
import { api } from "../src/api.js";

// Helper to mock global fetch for testing api()
function mockFetch(fn) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = fn;
  return () => {
    globalThis.fetch = originalFetch;
  };
}

test("1. GET request retrieves data and parses JSON", async () => {
  const restore = mockFetch(async (url, init) => {
    assert.equal(url, "http://127.0.0.1:8000/courses");
    assert.equal(init.method, "GET");
    assert.deepEqual(init.headers, {});
    return new Response(JSON.stringify([{ code: "INT2204", name: "CSDL Web" }]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  });
  try {
    const result = await api("/courses");
    assert.deepEqual(result, [{ code: "INT2204", name: "CSDL Web" }]);
  } finally {
    restore();
  }
});

test("2. POST request sends json body and Content-Type header", async () => {
  const restore = mockFetch(async (url, init) => {
    assert.equal(url, "http://127.0.0.1:8000/enrollments");
    assert.equal(init.method, "POST");
    assert.equal(init.headers["Content-Type"], "application/json");
    assert.equal(
      init.body,
      JSON.stringify({ student_id: "22000004", class_section_id: "WEB-01" })
    );
    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  });
  try {
    const res = await api("/enrollments", {
      method: "POST",
      body: { student_id: "22000004", class_section_id: "WEB-01" },
    });
    assert.deepEqual(res, { success: true });
  } finally {
    restore();
  }
});

test("3. DELETE request returning 204 returns null without parsing body", async () => {
  const restore = mockFetch(async (url, init) => {
    assert.equal(init.method, "DELETE");
    return new Response(null, { status: 204 });
  });
  try {
    const res = await api("/enrollments/22000004/WEB-01", { method: "DELETE" });
    assert.equal(res, null);
  } finally {
    restore();
  }
});

test("4. Non-JSON response throws invalid JSON error", async () => {
  const restore = mockFetch(async () => {
    return new Response("<html>Bad Gateway</html>", { status: 502 });
  });
  try {
    await assert.rejects(
      async () => await api("/sections"),
      (err) => {
        assert.match(err.message, /HTTP 502: phản hồi không phải JSON\./);
        return true;
      }
    );
  } finally {
    restore();
  }
});

test("5. HTTP error with string detail attaches status and message", async () => {
  const restore = mockFetch(async () => {
    return new Response(
      JSON.stringify({ detail: "Lớp học phần đã hết chỗ" }),
      { status: 409, headers: { "Content-Type": "application/json" } }
    );
  });
  try {
    await assert.rejects(
      async () => await api("/enrollments", { method: "POST", body: {} }),
      (err) => {
        assert.equal(err.status, 409);
        assert.equal(err.message, "HTTP 409: Lớp học phần đã hết chỗ");
        return true;
      }
    );
  } finally {
    restore();
  }
});

test("6. HTTP 422 with array detail formats messages joined by semicolon", async () => {
  const restore = mockFetch(async () => {
    return new Response(
      JSON.stringify({
        detail: [
          { msg: "student_id không hợp lệ" },
          { msg: "class_section_id bắt buộc" },
        ],
      }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  });
  try {
    await assert.rejects(
      async () => await api("/enrollments", { method: "POST", body: {} }),
      (err) => {
        assert.equal(err.status, 422);
        assert.equal(
          err.message,
          "HTTP 422: student_id không hợp lệ; class_section_id bắt buộc"
        );
        return true;
      }
    );
  } finally {
    restore();
  }
});

test("7. Network/CORS error wraps with Vietnamese connection instruction", async () => {
  const restore = mockFetch(async () => {
    throw new TypeError("Failed to fetch");
  });
  try {
    await assert.rejects(
      async () => await api("/sections"),
      (err) => {
        assert.match(
          err.message,
          /Không nhận được phản hồi API\. Kiểm tra Backend\/CORS/
        );
        return true;
      }
    );
  } finally {
    restore();
  }
});

test("8. AbortError is rethrown directly without being wrapped", async () => {
  const abortError = new Error("The operation was aborted");
  abortError.name = "AbortError";
  const restore = mockFetch(async () => {
    throw abortError;
  });
  try {
    await assert.rejects(
      async () => await api("/courses"),
      (err) => {
        assert.equal(err.name, "AbortError");
        assert.equal(err.message, "The operation was aborted");
        return true;
      }
    );
  } finally {
    restore();
  }
});

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <div className="max-w-md w-full rounded-lg border border-border bg-surface p-8 shadow-sm">
        <p className="text-sm font-semibold text-primary">MapNest</p>
        <h1 className="mt-2 text-2xl font-bold">ค้นหาบ้านบนแผนที่ อุดรธานี</h1>
        <p className="mt-2 text-muted">
          โครงโปรเจกต์พร้อมแล้ว — ขั้นต่อไป: ระบบค้นหา 3 มุมมอง (รายการ · รูปภาพ · แผนที่)
        </p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full bg-status-active px-3 py-1 text-white">ว่าง</span>
          <span className="rounded-full bg-status-reserved px-3 py-1 text-white">ติดจองแล้ว</span>
          <span className="rounded-full bg-status-sold px-3 py-1 text-white">ขายแล้ว</span>
          <span className="rounded-full bg-primary px-3 py-1 text-primary-foreground">ปุ่มหลัก</span>
        </div>
      </div>
    </main>
  );
}

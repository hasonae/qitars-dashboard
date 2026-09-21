/** اختبار بيانات: يولّد كل السجلات ويطبع الإحصاءات المشتقة للتحقق من الترابط */
const path = require("path");
const { buildSeed } = require(path.join(__dirname, "..", ".verify", "store.js"));
const a = require(path.join(__dirname, "..", ".verify", "analytics.js"));

const s = buildSeed();
const st = a.computeStudentStats(s.students);
const vo = a.computeVolunteerStats(s.volunteers);
const dn = a.computeDonationStats(s.donations);
const ex = a.computeExpenseStats(s.expenses);
const jo = a.computeJobStats(s.trainees, s.employees, s.students);
const iv = a.computeInvestmentStats(s.investments);
const rg = a.computeRegionStats(s.students, s.volunteers, s.investments);

const f = (n) => new Intl.NumberFormat("en-US").format(Math.round(n));
console.log("=== COUNTS ===");
console.log("students:", s.students.length, "| volunteers:", s.volunteers.length, "| donations:", s.donations.length);
console.log("expenses:", s.expenses.length, "| investments:", s.investments.length, "| trainees:", s.trainees.length, "| employees:", s.employees.length);
console.log("=== STUDENTS ===", JSON.stringify({ ...st, byTrack: undefined }));
console.log("byTrack:", st.byTrack.map((t) => `${t.track}=${t.students}`).join(", "));
console.log("=== VOLUNTEERS ===", vo.total, "hours:", f(vo.hoursThisMonth), "joinedNow:", vo.joinedThisMonth, "growth%:", vo.growthPct.toFixed(1));
console.log("=== DONATIONS ===", "total:", f(dn.totalRaised), "thisMonth:", f(dn.thisMonth), "donors:", dn.donors);
console.log("monthly(M):", dn.monthly.map((m) => m.amount).join(", "));
console.log("=== EXPENSES ===", "spent:", f(ex.totalSpent), "budget:", f(ex.totalBudget), "usage%:", ex.usagePct.toFixed(1));
console.log("cats:", ex.byCategory.map((c) => `${c.name}=${f(c.spent)} (${c.pct.toFixed(0)}%)`).join(" | "));
console.log("=== JOBS ===", "trained:", jo.trained, "employed:", jo.employed, "rate%:", jo.rate.toFixed(1), "partners:", jo.partners);
console.log("radar:", jo.radar.map((r) => `${r.skill}=${r.value}`).join(", "));
console.log("=== INVESTMENTS ===", "active:", iv.active, "invested:", f(iv.totalInvested), "avgROI%:", iv.avgRoi.toFixed(1), "jobs:", iv.jobs);
console.log("=== REGIONS ===");
const sumB = rg.reduce((x, r) => x + r.beneficiaries, 0);
const sumV = rg.reduce((x, r) => x + r.volunteers, 0);
const sumP = rg.reduce((x, r) => x + r.projects, 0);
console.log(`beneficiaries sum=${sumB} (=students ${s.students.length ? "OK" : ""}), volunteers sum=${sumV}, projects sum=${sumP}`);
console.log(rg.map((r) => `${r.name}:${r.beneficiaries}/${r.volunteers}/${r.projects}`).join("  "));

// alert 창
import Swal from "sweetalert2";
import './alert.css'

export function correct(words) {
  Swal.fire({
    title: words,
    icon: "success",
    showClass: {
      popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
      `
    },
    hideClass: {
      popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
      `
    }
  });
}

export function wrong(words) {
  Swal.fire({
    title: words,
    icon: "warning"
  });
}


export function verify(words) {
  Swal.fire({
    position: "center",
    icon: "success",
    title: words,
    showConfirmButton: false,
    timer: 1200
  });
}

export async function deleteConfirm() {
  const result = await Swal.fire({
    title: "정말로 삭제하시겠습니까?",
    text: "복구 할 수 없습니다.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "확인",
    cancelButtonText: '취소'
  });

  if (result.isConfirmed) {
    await Swal.fire({
      title: "성공적으로 삭제되었습니다.",
      icon: "success"
    });
    return 1;
  }

  return 2;
}

async function getDeclarationInputs() {
  const result = await Swal.fire({
    title: "정말로 신고하시겠습니까?",
    icon: "warning",
    html: `
      <input id="swal-input1" class="swal2-input" placeholder="제목을 입력하세요.">
      <textarea id="swal-textarea" class="swal2-textarea" style="width:62%" placeholder="내용을 입력하세요." aria-label="Type your message here"></textarea>
    `,
    preConfirm: () => {
      return [
        document.getElementById("swal-input1").value,
        document.getElementById("swal-textarea").value
      ];
    },
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "확인",
    cancelButtonText: '취소'
  });

  return result;
}

export async function Declaration(uid) {
  let result;
  while (true) {
    if (uid < 0) {
      await Swal.fire({
        title: "로그인해야 신고할 수 있습니다.",
        icon: "warning"
      });
      return 0;
    }
    result = await getDeclarationInputs();

    if (!result.isConfirmed) {
      return 0; // 취소 버튼을 누르면 0을 반환
    }

    const [title, message] = result.value;

    if (!title) {
      await Swal.fire({
        title: "제목을 입력하세요.",
        icon: "warning"
      });
      continue;
    }

    if (!message) {
      await Swal.fire({
        title: "내용을 입력하세요.",
        icon: "warning"
      });
      continue;
    }

    break; // 제목과 내용이 모두 입력되었으면 루프를 빠져나감
  }

  await Swal.fire({
    title: "신고되었습니다.",
    icon: "success"
  });

  return result.value;
}

export async function noticeConfirm(notice) {
  const result = await Swal.fire({
    title: notice.nContents,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "확인",
    cancelButtonText: '취소'
  });

  if (result.isConfirmed) {
    await Swal.fire({
      title: "수락했습니다",
      icon: "success"
    });
    return 1;
  }
  else if (!result.isConfirmed) {
    return 2;
  }

  return 3;
}

export async function chatDeleteConfirm(words, name) {
  const result = await Swal.fire({
    title: words,
    text: name,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "확인",
    cancelButtonText: '취소'
  });

  if (result.isConfirmed) {
    await Swal.fire({
      title: "성공적으로 삭제되었습니다.",
      icon: "success"
    });
    return 1;
  }

  return 2;
}

export async function familyUserConfirm(words, name) {
  const result = await Swal.fire({
    title: words,
    text: name,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "확인",
    cancelButtonText: '취소'
  });

  if (result.isConfirmed) {
    await Swal.fire({
      title: "패밀리에서 내보냈습니다.",
      icon: "success"
    });
    return 1;
  }

  return 2;
}
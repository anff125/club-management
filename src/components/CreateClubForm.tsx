import { useState } from "react";
import { ClubService } from "../api";

interface CreateClubFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateClubForm = ({ onClose, onSuccess }: CreateClubFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState<number>(100);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("社團名稱不能為空");
      return;
    }

    if (maxMembers < 1) {
      setError("社團人數上限必須大於 0");
      return;
    }

    if (maxMembers > 500) {
      setError("社團人數上限不能超過 500");
      return;
    }

    try {
      setIsSubmitting(true);
      await ClubService.createClub({
        name: name.trim(),
        description: description.trim(),
        memberCount: {
          current: 1, // 建立者自己
          max: maxMembers,
        },
        presidentName: "目前登入者", // 實際應用中應從用戶資料中獲取
        userRole: "社長",
        status: "active",
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError("建立社團時發生錯誤，請稍後再試");
      console.error("建立社團失敗:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMaxMembersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setMaxMembers(value);
    }
  };

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">建立新社團</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isSubmitting}
              title="關閉"
              aria-label="關閉"
            ></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="clubName" className="form-label">
                  社團名稱 <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="clubName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  maxLength={100}
                />
                <div className="form-text">{name.length}/100 字元</div>
              </div>

              <div className="mb-3">
                <label htmlFor="clubDescription" className="form-label">
                  社團描述
                </label>
                <textarea
                  className="form-control"
                  id="clubDescription"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                  maxLength={500}
                  placeholder="請描述您的社團目標、活動內容等..."
                ></textarea>
                <div className="form-text">{description.length}/500 字元</div>
              </div>

              <div className="mb-3">
                <label htmlFor="maxMembers" className="form-label">
                  社團人數上限 <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="maxMembers"
                  min="1"
                  max="500"
                  value={maxMembers}
                  onChange={handleMaxMembersChange}
                  disabled={isSubmitting}
                  required
                />
                <div className="form-text">建議設定在 20-200 人之間</div>
              </div>

              <div className="alert alert-info">
                <small>
                  <strong>注意事項：</strong>
                  <ul className="mb-0 mt-2">
                    <li>建立後您將自動成為社團社長</li>
                    <li>社團名稱建立後可以修改</li>
                    <li>人數上限可以後續調整</li>
                  </ul>
                </small>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      建立中...
                    </>
                  ) : (
                    "建立社團"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClubForm;
